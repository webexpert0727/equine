import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_MAKEUPLESSONS:
        return action.payload.makeupLessons;
        break;
    }
    return state;
}
