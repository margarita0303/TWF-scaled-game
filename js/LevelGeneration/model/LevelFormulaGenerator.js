class LevelFormulaGenerator {

    constructor(scene, params) {
        console.log('level formula generator has been called');
        this.scene = scene;

        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressions = params.initialExpressions;
        this.substitutions = params.substitutions;

        for (let substitution of this.substitutions) {
            substitution.diff = substitution.target.length - substitution.origin.length;
        }

        for (let substitution of this.substitutions) {
            substitution.origin = TWF.api.stringToStructureString(substitution.origin, "setTheory");
            substitution.target = TWF.api.stringToStructureString(substitution.target, "setTheory");
        }

        this.numberOfGeneratedFormulas = 0;
        this.shuffler = new Shuffler(this);
    }

    nextFormula() {
        if (this.formula === undefined) {
            console.log('formula is undefined');
            this.initializeFormula(); }
        else {
            console.log('formula: ' + this.formula.label);
            this.transformFormula(); }

        this.numberOfGeneratedFormulas += 1;

        return this.formula;
    }

    levelComplete() {
        return this.numberOfGeneratedFormulas === this.numberOfFormulas;
    }

    progress() {
        return this.numberOfGeneratedFormulas / this.numberOfFormulas;
    }

    urlForRawFormula(rawFormula) {
        let height = this.heightForRawFormula(rawFormula);
        let texFormula = rawFormula.split("\\").join("\\backslash ")
            .split("|").join("\\vee ")
            .split("&").join("\\wedge ")
            .split("->").join("\\rightarrow ")
            .split("!").join("\\neg ");

        return 'https://chart.apis.google.com/chart?cht=tx' +  // tex parameter
            '&chs=' + height +                                 // specify the height of formula
            '&chl=' + encodeURIComponent(texFormula) +         // specify the text of formula
            '&chf=bg,s,00000000'                               // make transparent background
    }

    heightForRawFormula(rawFormula) {
        return 50;
    }

    initializeFormula() {
        let randomInitialExpression
            = this.initialExpressions[Math.floor(Math.random() * this.initialExpressions.length)];

        // let substitutionPlaces = this.getSubstitutionPlaces(randomInitialExpression, randomInitialExpression);
        //
        // if (0 < substitutionPlaces.length) {
        //     let rawFormula = this.applySubstitution(randomInitialExpression, randomInitialExpression, substitutionPlaces);
        //
        //     this.formula = {
        //         'label':        rawFormula,
        //         'url':          this.urlForRawFormula(randomInitialExpression),
        //         'scoreForHit':  0,
        //         'scoreForSkip': 0,
        //         "origin":       rawFormula,
        //         "target":       0
        //     };
        //
        //     // label == target
        //
        //     break;
        // }

        // target == 0 is not a problem, we do not have target at this moment
        // we do not need origin too at this moment

        this.formula = {
            'label':        randomInitialExpression,
            'url':          this.urlForRawFormula(randomInitialExpression),
            'scoreForHit':  0,
            'scoreForPass': 0,
            "origin":       randomInitialExpression,
            "target":       0
        }
    }

    transformFormula() {
        let expression = this.formula.label;
        // console.log("substitutions", this.substitutions);
        let shuffledSubstitutions = this.shuffler.shuffledSubstitutions();
        // console.log("shuffled substitutions", shuffledSubstitutions);

        for (let substitution of shuffledSubstitutions) {
            let substitutionPlaces = this.getSubstitutionPlaces(expression, substitution);

            if (0 < substitutionPlaces.length) {

                // ХОТИМ привести substitution.origin, substitution.target к нужному виду

                let rawFormula = this.applySubstitution(expression, substitution, substitutionPlaces);

                // console.log("rawformula", rawFormula);
                // console.log("origin", substitution.origin);
                // console.log("target", substitution.target);

                console.log(substitution.origin);
                console.log(substitution.target);
                console.log(this.structureStringToString(substitution.origin));
                console.log(this.structureStringToString(substitution.target))

                this.formula = {
                    'label':        rawFormula,
                    'url':          this.urlForRawFormula(rawFormula),
                    'scoreForHit':  substitution.scoreForHit,
                    'scoreForSkip': substitution.scoreForSkip,
                    "origin":       this.structureStringToString(substitution.origin),
                    "target":       this.structureStringToString(substitution.target)
                };

                // console.log("origin, target", this.formula.origin, this.formula.target);
                // label == target

                break;
            }
        }
    }

    getSubstitutionPlaces(expression, substitution) {
        let substitutionPlacesJSON = TWF.api.findSubstitutionPlacesJSON(
            expression,
            substitution.origin, substitution.target,
            "setTheory"
        );
        return JSON.parse(substitutionPlacesJSON).substitutionPlaces;
    }

    applySubstitution(expression, substitution, place) {
        if (place.constructor === Array) {
            place = this.pickRandomElement(place);
        }

        return TWF.api.applySubstitution(expression,
            substitution.origin, substitution.target,
            parseInt(place.parentStartPosition), parseInt(place.parentEndPosition),
            parseInt(place.startPosition), parseInt(place.endPosition),
            "setTheory")
    }

    canBeReplaced(expression) {
        let expressionInNewFormat = expression.slice();
        expressionInNewFormat = expressionInNewFormat.replace("implic(A;B)", "A->B");
        expressionInNewFormat = expressionInNewFormat.replace("implic(!A;B)", "!A->B");
        expressionInNewFormat = expressionInNewFormat.replace("implic(A;!B)", "A->!B");
        expressionInNewFormat = expressionInNewFormat.replace("implic(!A;!B)", "!A->!B");
        expressionInNewFormat = expressionInNewFormat.replace("or(A;B)", "A|B");
        expressionInNewFormat = expressionInNewFormat.replace("or(!A;B)", "!A|B");
        expressionInNewFormat = expressionInNewFormat.replace("or(A;!B)", "A|!B");
        expressionInNewFormat = expressionInNewFormat.replace("or(!A;!B)", "!A|!B");
        expressionInNewFormat = expressionInNewFormat.replace("and(A;B)", "A&B");
        expressionInNewFormat = expressionInNewFormat.replace("and(!A;B)", "!A&B");
        expressionInNewFormat = expressionInNewFormat.replace("and(A;!B)", "A&!B");
        expressionInNewFormat = expressionInNewFormat.replace("and(!A;!B)", "!A&!B");
        expressionInNewFormat = expressionInNewFormat.replace("not(A)", "!A");
        expressionInNewFormat = expressionInNewFormat.replace("not(B)", "!B");
        expressionInNewFormat = expressionInNewFormat.replace("not(!B)", "!!B");
        expressionInNewFormat = expressionInNewFormat.replace("not", "!");

        if(expressionInNewFormat === expression) {
            return false;
        }
        return true;
    }

    structureStringToString(expression) {
        let expressionInNewFormat = expression.slice();

        while (this.canBeReplaced(expressionInNewFormat)) {
            expressionInNewFormat = expressionInNewFormat.replace("implic(A;B)", "A->B");
            expressionInNewFormat = expressionInNewFormat.replace("implic(!A;B)", "!A->B");
            expressionInNewFormat = expressionInNewFormat.replace("implic(A;!B)", "A->!B");
            expressionInNewFormat = expressionInNewFormat.replace("implic(!A;!B)", "!A->!B");
            expressionInNewFormat = expressionInNewFormat.replace("or(A;B)", "A|B");
            expressionInNewFormat = expressionInNewFormat.replace("or(!A;B)", "!A|B");
            expressionInNewFormat = expressionInNewFormat.replace("or(A;!B)", "A|!B");
            expressionInNewFormat = expressionInNewFormat.replace("or(!A;!B)", "!A|!B");
            expressionInNewFormat = expressionInNewFormat.replace("and(A;B)", "A&B");
            expressionInNewFormat = expressionInNewFormat.replace("and(!A;B)", "!A&B");
            expressionInNewFormat = expressionInNewFormat.replace("and(A;!B)", "A&!B");
            expressionInNewFormat = expressionInNewFormat.replace("and(!A;!B)", "!A&!B");
            expressionInNewFormat = expressionInNewFormat.replace("not(A)", "!A");
            expressionInNewFormat = expressionInNewFormat.replace("not(!A)", "!!A");
            expressionInNewFormat = expressionInNewFormat.replace("not(B)", "!B");
            expressionInNewFormat = expressionInNewFormat.replace("not(!B)", "!!B");
            expressionInNewFormat = expressionInNewFormat.replace("not", "!");
        }

        return expressionInNewFormat;
    }

    // applyIdSubstitution(expression, substitution, place) {
    //     if (place.constructor === Array) {
    //         place = this.pickRandomElement(place);
    //     }
    //
    //
    //     let tmp = TWF.api.structureStringToExpression_69c2cy$(substitution.origin);
    //     console.log("tmp", tmp);
    //     let tmp2 = TWF.api.applySubstitution(substitution.origin,
    //         substitution.origin, substitution.origin,
    //         parseInt(place.parentStartPosition), parseInt(place.parentEndPosition),
    //         parseInt(place.startPosition), parseInt(place.endPosition),
    //         "setTheory");
    //     console.log(tmp2);
    //
    //
    //     return TWF.api.applySubstitution(substitution.origin,
    //         substitution.origin, substitution.origin,
    //         parseInt(place.parentStartPosition), parseInt(place.parentEndPosition),
    //         parseInt(place.startPosition), parseInt(place.endPosition),
    //         "setTheory")
    // }

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

}