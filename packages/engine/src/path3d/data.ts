import { Path3D } from './path3d';

const createdPathObjects: Path3D[] = [];


function addPathObject(path: Path3D): void {
    createdPathObjects.push(path);
}

function removePathObject(path: Path3D): void {
    const index = createdPathObjects.indexOf(path);
    if (index !== -1) {
        const deleteObject = createdPathObjects.splice(index, 1);
        deleteObject[0].parent?.remove(deleteObject[0]);
        deleteObject[0].dispose();
    }
}

export {
    addPathObject,
    removePathObject,
}