import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_SECTIONS:
        return action.payload.sections;
        break;
    }
    return state;
}
