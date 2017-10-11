import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_PROGRAMS:
        return action.payload.programs;
        break;
    }
    return state;
}
