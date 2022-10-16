exports.validateInputUpdate = (req, res, next) => {

    //on recupere l'objet que l'on parse ou non s'il contient une image et on ajoute le userId du TOKEN
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: req.auth.userId,
    } : {
        ...req.body,
        userId: req.auth.userId,

    };

    // fonction qui teste que la veleur ne soit pas vide
    const notEmpty = (value, messageError) => {
        value = value.trim();
        console.log(value)
        if (value === "") {
            res.status(400).json({ error: `${messageError} ne peut pas être vide` })
            return false;
        }
        return true;
    }
    // fonction qui teste que la veleur soit un nombre
    const number = (value, messageError) => {

        if (/\d/.test(value) === false) {
            res.status(400).json({ error: `${messageError} doit être un nombre` })
            return false
        }
        return true;
    }

    //FONCTION qui teste que la saisie de nom et prénom soit valide
    const validName = (sauceObject) => {
        if (notEmpty(sauceObject.name, "name") === false) {
            return false;
        }
        return true;
    }

    const validManufacturer = (sauceObject) => {
        if (notEmpty(sauceObject.manufacturer, "manufacturer") === false) {
            return false;
        }
        return true;
    }

    const validDescription = (sauceObject) => {
        if (notEmpty(sauceObject.description, "description") === false) {
            return false;
        }
        return true;
    }

    const validHeat = (sauceObject) => {
    const heat = sauceObject.heat
    
        if (heat < 1 || heat > 10) {
        res.status(400).json({ error: "heat doit être compris entre 1 et 10" })
        return false;
    }
        if (number(heat, "heat") === false) {
            return false;
        }
        if (heat < 1 || heat > 10) {
            res.status(400).json({ error: "heat doit être un nombre compris entre 1 et 10" })
            return false;
        }
        return true;
    }

    const validMainPepper = (sauceObject) => {
        if (notEmpty(sauceObject.mainPepper, "mainPepper") === false) {
            return false;
        }
        return true;
    }

    const isvalidName = validName(sauceObject);
    const isvalidManufacturer = validManufacturer(sauceObject);
    const isvalidDescription = validDescription(sauceObject);
    const isvalidHeat = validHeat(sauceObject);
    const isvalidMainPepper = validMainPepper(sauceObject);

    if (isvalidName && isvalidManufacturer && isvalidDescription && isvalidHeat && isvalidMainPepper) {
        return sauceObject
   
    } else {

        return false
    }

}