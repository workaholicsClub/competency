function findMetadataByItemId(metadata, searchedId) {
    return metadata ? metadata.find( item => item.itemId === searchedId ) || false : false;
}

function getMetadataFlag(metadata, field) {
    return metadata && metadata[field] ? '1' : '0';
}

function stateKey(metadata, itemId) {
    let itemMetadata = findMetadataByItemId(metadata, itemId);
    let flags = ['complete', 'like', 'bookmark'].map(flag => getMetadataFlag(itemMetadata, flag));

    return itemId+'_'+flags.join('');
}

function shallowClone(srcObject) {
    return Object.assign({}, srcObject);
}

export {findMetadataByItemId, stateKey, shallowClone};