import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_PROGRAMTYPES:
        return action.payload.programTypes;
        break;
    }
    return state;
}
