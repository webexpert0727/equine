import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
        case Constants.GET_HORSES:
            return action.payload.horses;
            break;
    }
    return state;
}
