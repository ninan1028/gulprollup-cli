import Promise from '../lib/promise'

export let testPromise = ()=>{
    return new Promise((resolve, reject)=>{
        resolve('success');
    })
}