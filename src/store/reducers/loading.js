/**
 * Created by dfc on 2018/5/16
 */
import {SHOW, HIDE} from "src/store/actions/loading";

const initState = {
    loading: false
};
const loading = (state = initState, action) => {
    switch (action.type) {
        case SHOW:
            return {...state, loading: true};
        case HIDE:
            return {...state, loading: false};
        default:
            return state;
    }
};
export default loading;