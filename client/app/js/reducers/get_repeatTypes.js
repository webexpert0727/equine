import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_REPEATTYPES:
        return action.payload.repeatTypes;
        break;
    }
    return state;
}
