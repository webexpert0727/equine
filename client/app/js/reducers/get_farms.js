import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_FARMS:
        return action.payload.farms;
        break;
    }
    return state;
}
