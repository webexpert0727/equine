import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_INSTRUCTORS:
        return action.payload.instructors;
        break;
    }
    return state;
}
