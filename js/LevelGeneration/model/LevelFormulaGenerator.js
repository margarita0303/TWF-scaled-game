class LevelFormulaGenerator {

    constructor(scene, params) {
        console.log('level formula generator has been called');
        this.scene = scene;

        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressions = params.initialExpressions;
        this.substitutions = params.substitutions;
        this.numberOfLastSubstitution = -1;

        for (let substitution of this.substitutions) {
            substitution.diff = substitution.target.length - substitution.origin.length;
        }

        for (let substitution of this.substitutions) {
            substitution.origin = TWF.api.stringToStructureString(substitution.origin, "setTheory");
            substitution.target = TWF.api.stringToStructureString(substitution.target, "setTheory");
        }

        this.numberOfGeneratedFormulas = 0;
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
            .split("->").join("\\rightarrow ");

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
        console.log(randomInitialExpression)
        this.formula = {
            'label':        randomInitialExpression,
            'url':          this.urlForRawFormula(randomInitialExpression),
            'scoreForHit':  0,
            'scoreForPass': 0
        }
    }

    transformFormula() {
        let expression = this.formula.label;
        let currentNumberOfSubstitution = 0;

        for (let substitution of this.substitutions) {
            if (currentNumberOfSubstitution <= this.numberOfLastSubstitution) {
                currentNumberOfSubstitution += 1;
                continue;
            }

            let substitutionPlaces = this.getSubstitutionPlaces(expression, substitution);

            if (0 < substitutionPlaces.length) {
                this.numberOfLastSubstitution = currentNumberOfSubstitution;
                let rawFormula = this.applySubstitution(expression, substitution, substitutionPlaces);

                this.formula = {
                    'label':        rawFormula,
                    'url':          this.urlForRawFormula(rawFormula),
                    'scoreForHit':  substitution.scoreForHit,
                    'scoreForSkip': substitution.scoreForSkip
                };

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

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

}