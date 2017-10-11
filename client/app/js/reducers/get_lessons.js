import Constants   from   "../constants";

const defaultState = { student: {}, lessons: [] };

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_LESSONS:
        return action.payload.lessons;
        break;
    }
    return state;
}
