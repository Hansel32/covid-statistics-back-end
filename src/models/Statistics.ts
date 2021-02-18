import mongoose from "mongoose";

export type StatisticsDocument = mongoose.Document & {
    results: number;
    response: Response[];
};

export interface Response {
    continent: string;
    country: string;
    population: string;
    cases: Cases[];
    deaths: Deaths[];
    tests: Tests[];
    day: string;
    time: string;
}

export interface Cases {
    new: number;
    active: number;
    critical: number;
    recovered: number;
    "1M_pop": number;
    total: number;
}

export interface Deaths {
    new: number;
    "1M_pop": number;
    total: number;
}

export interface Tests {
    "1M_pop": number;
    total: number;
}

const statisticsSchema = new mongoose.Schema<StatisticsDocument> ({
    results: Number,
    response: Array,
}, {timestamps: true})

export const Statistics = mongoose.model<StatisticsDocument>("Statistics", statisticsSchema );
