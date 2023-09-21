

const saveToken = (token:string, nombre:string, rol:string, email:string)=>{

    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userRol', rol);
    localStorage.setItem('userEmail', email);
}

const getToken = ()=>{

    const storedToken = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('userName');
    const storedRol = localStorage.getItem('userRol');
    const storedEmail = localStorage.getItem('userEmail');

    return {storedToken, storedName, storedRol, storedEmail }
}

const removeToken = ()=>{
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRol');
    localStorage.removeItem('userEmail');
}

export {saveToken, getToken, removeToken}