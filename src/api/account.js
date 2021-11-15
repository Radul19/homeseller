const axios = require("axios").default
// const url = "http://localhost:4000/"
const url = "https://home-seller-back.herokuapp.com/"
// const { useContext } = require("react")
// const { UserContext } = require("./userContext")

const catchError = async (err) => {
    if (err.response) {
        console.log(err.response)
        return err.response
    } else if (err.request) {
        console.log(err.request)
        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }
    } else {
        console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, contacte al administrador" } }
    }
}

const loginUser = async (data) => {
    let response
    const { email, password } = data
    await axios.get(`${url}login/${email}/${password}`)
        .then((res) => {
            console.log(res)
            response = res
        }).catch((err) => {
            response = catchError(err)
        })
    return response

}

const register = async (item, type) => {
    const { username, email, password, confirmPassword } = item
    let response
    await axios.post(`${url}register`, {
        username,
        email,
        password,
        confirmPassword,
        type
    }).then(res => {
        response = res
    })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

const getUser = async (id) => {
    let response
    await axios.get(`${url}user/${id}`)
        .then(res => {
            response = res
        })
        .catch(err => {
            console.log("err?")
            response = catchError(err)
        })
    return response
}

const editData = async (data, type) => {
    let response
    await axios.post(`${url}edit`, { data, type })
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

const createItem = async (dataOriginal, files) => {
    const data = { ...dataOriginal }
    let response
    const formData = new FormData()

    ///Delete Url of each map to put in aux
    data.images.map((item, index) => {
        delete data.images[index].url
        return 0
    })
    /// Stringify aux to append FormData
    const aux = JSON.stringify(data.images)
    formData.append("aux", aux)
    /// Delete iamges
    delete data.images
    ///Append Data
    for (var key in data) {
        formData.append(key, data[key]);
    }
    ///Apend files
    files.forEach(element => {
        formData.append("images", element)
    });
    await axios.post(`${url}createItem`, formData)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}


const getItem = async (id) => {
    let response
    await axios.get(`${url}getItem/${id}`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}


const getAll = async () => {
    let response
    await axios.get(`${url}getAllItems`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}
let api

export default api = {
    getAll,getItem,createItem,editData,getUser,register,loginUser
}