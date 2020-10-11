import { 
    QuestionData, 
    getUnansweredQuestions,
    postQuestion,
    PostQuestionData
} from "./QuestionData";

import { 
    Action,
    ActionCreator,
    Dispatch,
    Reducer,
    combineReducers,
    Store,
    createStore,
    applyMiddleware
} from 'redux';
import thunk, { ThunkAction } from "redux-thunk";
import { create } from "domain";

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

const questionReducer: Reducer<QuestionState, QuestionsActions> = (
    state = initialQuestionsState,
    action
) => {
    switch (action.type) {
        case 'GettingUnansweredQuestions': {
            return {
                ...state,
                unanswered: null,
                loading: true,
            }
        }
        case 'GotUnasnweredQuestions': {
            return {
                ...state,
                unanswered: action.questions,
                loading: false,
            }
        }
        case 'PostedQuestion': {
            return {
                ...state,
                unanswered: action.result
                    ? (state.unanswered || []).concat(action.result)
                    : state.unanswered,
                postedResult: action.result
            }
        }
        default: {
            neverReached(action)
        }
    }

    return state;
}

const neverReached = (never: never) => {};

const rootReducer = combineReducers<AppState>({
   questions: questionReducer 
});

export function configureStore(): Store<AppState> {
    const store = createStore(
        rootReducer,
        undefined,
        applyMiddleware(thunk),
    );

    return store;
}