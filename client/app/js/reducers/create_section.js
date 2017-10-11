import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.CREATE_SECTION:
        return action.payload.createSectionStatus;
        break;
    }
    return state;
}

