

const saveToken = (token:string, nombre:string, rol:string, email:string, logo:string)=>{

    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userRol', rol);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('logo', logo)
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
    localStorage.removeItem('logo');
}

const getLogo = ()=>{

    const storedEmail = localStorage.getItem('logo');

    return storedEmail;
}

export {saveToken, getToken, removeToken, getLogo}