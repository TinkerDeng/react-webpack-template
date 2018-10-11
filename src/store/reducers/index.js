/**
 * Created by dfc on 2018/5/16
 */
import {combineReducers} from 'redux';
import loading from 'src/store/reducers/loading';

const rootReducer = combineReducers({
    loading
});

export default rootReducer;