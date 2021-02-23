import { Statistics } from "../models/Statistics";
import {Request, Response, NextFunction, response} from "express";

export const addCountry = async (req: Request, res: Response, next: NextFunction) => {


     const countryName = req.body.countryName;

     Statistics.findOne({}, (err, docs) => {

         const countries = docs.response;
         let selectedCountry;
         let index;

         for (let item of countries) {
             if (item.country === countryName) {
                 selectedCountry = item;
                 index = countries.indexOf(item);
                 break;
             }
         }

        selectedCountry.cases.new++;
        docs.response.set(index, selectedCountry);

        docs.save((err) => {
           if (err) {
               return next(err);
           }

            res.send(docs);
        });
    });
}
