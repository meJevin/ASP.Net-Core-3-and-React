import { QuestionData, getUnansweredQuestions } from "./QuestionData";
import { Action, ActionCreator, Dispatch } from 'redux';

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

export const getUnansweredQuestionsActionCreator = () => {
    return async (dispatch: Dispatch) => {
        const action: GettingUnansweredQuestionsAction = {
            type: 'GettingUnansweredQuestions'
        };

        dispatch(action);
    };
}