import { GroupConstants } from '../constants';
import { Api } from '../api';

export const groupActions = {
    loadGroups,
    deleteAllGroups,
    createGroups
};

function loadGroups() {
    return dispatch => {
        dispatch(request());
        Api.getAllGroups()
        .then(data => dispatch(success(data)))
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: GroupConstants.LOAD_IN_PROGRESS } }
    function success(groups) { return { type: GroupConstants.LOAD_SUCCESS, groups: groups } }
    function failure(error) { return { type: GroupConstants.LOAD_FAILED, error: error } }
}

function deleteAllGroups(){
    return dispatch => {
        // FIXME: use groups from store instead
        Api.getAllGroups()
        .then(
            data => {
                Object.keys(data).forEach(groupId => Api.deleteGroup(groupId)
                    .then(
                        group => dispatch(success(group))
                    )
                    .catch(error => dispatch(failure(error)))
                )
           }
        ).catch(error => dispatch(failure(error)))
    }
    
//    function request() { return { type: GroupConstants.SAVE_IN_PROGRESS } }
    function success(group) { return { type: GroupConstants.SAVE_SUCCESS, group: group } }
    function failure(error) { return { type: GroupConstants.SAVE_FAILED, error: error } }
}

function createGroups(groupsByDepth) {
    return async dispatch => {
        dispatch(request());
        const maxDepth = Math.max(...Object.keys(groupsByDepth));
        const idMap = {};
        
        console.log(maxDepth);
        //replace cycle by recursive function
        const sentGroupsToServer = (depth) => {
            console.log(depth);
            console.log(idMap);
            Promise.all(
                Object.values(groupsByDepth[depth]).map(
                    (group) => {
                        let oldGroup = group;
                        if (oldGroup.promotionId){
                            oldGroup.promotionId = idMap[oldGroup.promotionId];
                        }
                        return Api.createGroup(group).then (
                            //map new group's id to old group's id
                            newGroup => {
                                idMap[group.id] = newGroup.id;
                                //console.log(idMap);
                                //console.log(idMap[group.id])
                                dispatch(success(newGroup));
                            }
                        )
                        .catch(error => dispatch(failure(error)))
                    }
                )
            ).then (
                () => {
                    if (depth >= 1){
                        sentGroupsToServer(depth - 1);
                    }
                }
            )
        }
        
        sentGroupsToServer(maxDepth);
    }

    function request() { return { type: GroupConstants.SAVE_IN_PROGRESS } }
    function success(group) { return { type: GroupConstants.SAVE_SUCCESS, group: group } }
    function failure(error) { return { type: GroupConstants.SAVE_FAILED, error: error } }
}