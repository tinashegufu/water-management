import Page from "./Page";
import { useNavigate } from 'react-router-dom'

class Splashscreen extends Page {

    componentDidMount() {

        const self = this;

        setTimeout(function() {
            self.props.redirect('/dashboard');
        }, 3000)
    }
    _render(){
        return "Hello World"
    }
    
}


function SplashscreenWrapper() {

    const redirect = useNavigate();
    return <Splashscreen redirect={redirect} />
}

export default SplashscreenWrapper;