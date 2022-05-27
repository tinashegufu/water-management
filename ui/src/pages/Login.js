import Page from "./Page";
import { useNavigate } from 'react-router-dom'

class Login extends Page{
    _render(){
        return "Input Form Here"
    }
}

function LoginWrapper() {

    const redirect = useNavigate();
    return <Login redirect={redirect} />
}

export default LoginWrapper;