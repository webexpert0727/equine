import Constants   from   "../constants";

const defaultState = { person: {}, student: {}, billings: [], last_lesson: {}, next_lesson: {}, upcoming_lessons: [] };

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_CLIENT:
        return action.payload.client;
        break;
    }
    return state;
}
