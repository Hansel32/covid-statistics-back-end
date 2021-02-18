import { Request, Response, NextFunction } from "express";
import "../config/passport";
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import {COVID_19_API_URL, RAPID_API_KEY} from "../util/secrets";
import { Statistics, StatisticsDocument } from "../models/Statistics";

/**
 * Get data for dashboard (home) view
 * @route get /Dashboard
 *
 */

export const getCountry = async (req: Request, res: Response, next: NextFunction) => {
    Statistics.find({}, (err, docs) => {
        const countries: any = docs[0].response
        let country;

        for (let item of countries) {
            if (item.country === req.params.id) {
                country = item;
            }
        }
        res.status(200).send(country);
    });
}

/**
 * Get data for dashboard (home) view
 * @route get /Dashboard
 *
 */

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {

    Statistics.find({}, (err, docs) => {

        const countries: any = docs[0].response
        let asia = {confirmedCases: 0, deaths: 0};
        let europe = {confirmedCases: 0, deaths: 0};
        let america = {confirmedCases: 0, deaths: 0};
        let australia = {confirmedCases: 0, deaths: 0};
        let africa = {confirmedCases: 0, deaths: 0};

        for (let item of countries) {

            switch (item.country) {
                case 'Asia': {
                    asia.confirmedCases =++ item.cases.total;
                    asia.deaths =++ item.deaths.total;
                    break;
                }

                case 'Europe': {
                    europe.confirmedCases =++ item.cases.total;
                    europe.deaths =++ item.deaths.total;
                    break;
                }

                case 'North-America' : {
                    america.confirmedCases =++ item.cases.total;
                    america.deaths =++ item.deaths.total;
                    break;
                }
                case 'South-America' : {
                    america.confirmedCases =++ item.cases.total;
                    america.deaths =++ item.deaths.total;
                    break;
                }

                case 'Oceania' : {
                    australia.confirmedCases =++ item.cases.total;
                    australia.deaths =++ item.deaths.total;
                    break;
                }

                case 'Africa' : {
                    africa.confirmedCases =++ item.cases.total;
                    africa.deaths =++ item.deaths.total;
                    break;
                }
            }
        }

        let data = [{
            continent: 'Asia',
            data: asia
        }, {
            continent: 'Europe',
            data: europe
        }, {
            continent: 'America',
            data: america
        }, {
            continent: 'Australia',
            data: australia
        }, {
            continent: 'Africa',
            data: africa
        }]
        res.status(200).send(data);
    });

}

export const getSyncApi = async (req: Request, res: Response, next: NextFunction) => {
    axios.get(COVID_19_API_URL, {headers:
            {'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': "covid-193.p.rapidapi.com",
                "useQueryString": true
            }
    }).then((response) => {

        const responseArray = response.data.response;
        let statistics = new Statistics({
             results: response.data.results,
             response: responseArray
        });

        statistics.save((err) => {
           if (err) {
               return next(err);
           }
           res.status(200).send('success syncing');
        });
    });
}

