import { 
    QuestionData, 
    getUnansweredQuestions,
    postQuestion,
    PostQuestionData
} from "./QuestionData";

import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from "redux-thunk";

interface QuestionState {
    readonly loading: boolean;
    readonly unanswered: QuestionData[] | null;
    readonly postedResult?: QuestionData;
}

export interface AppState {
    readonly questions: QuestionState;
}

const initialQuestionsState: QuestionState = {
    loading: false,
    unanswered: null,
}

export interface GettingUnansweredQuestionsAction 
extends Action<'GettingUnansweredQuestions'> {

}

export interface GotUnasnweredQuestionsAction
extends Action<'GotUnasnweredQuestions'> {
    questions: QuestionData[];
}

export interface PostedQuestionAction
extends Action<'PostedQuestion'> {
    result: QuestionData | undefined;
} 

type QuestionsActions =
    | GettingUnansweredQuestionsAction
    | GotUnasnweredQuestionsAction
    | PostedQuestionAction;

export const getUnansweredQuestionsActionCreator:
ActionCreator<ThunkAction<
    Promise<void>,
    QuestionData[],
    null,
    GotUnasnweredQuestionsAction
    >
> = () => {
    return async (dispatch: Dispatch) => {
        const gettingAction: GettingUnansweredQuestionsAction = {
            type: 'GettingUnansweredQuestions'
        };

        dispatch(gettingAction);

        const questions = await getUnansweredQuestions();

        const gotAction: GotUnasnweredQuestionsAction = {
            type: 'GotUnasnweredQuestions',
            questions: questions,
        }

        dispatch(gotAction);
    };
}

export const postQuestionActionCreator:
ActionCreator<ThunkAction<
    Promise<void>,
    QuestionData,
    PostQuestionData,
    PostedQuestionAction
    >
> = (question: PostQuestionData) => {
    return async (dispatch: Dispatch) => {
        const result = await postQuestion(question);

        const postedQuestionAction: PostedQuestionAction = {
            type: 'PostedQuestion',
            result
        };

        dispatch(postedQuestionAction);
    };
}

export const clearPostedQuestionActionCreator: 
ActionCreator<PostedQuestionAction> = () => {
    const postedQuestionAction: PostedQuestionAction = {
        type: "PostedQuestion",
        result: undefined,
    };

    return postedQuestionAction;
};