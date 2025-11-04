import { validationResult } from "express-validator";

export const validacionErrores = (req, res, next) => {
    console.log(req);
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.isEmpty());
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }
    next();
}
