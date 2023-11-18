import {useCorbado} from "@corbado/react-sdk";

const HomePage = () => {
    const {} = useCorbado()
    const username = 'Martin'

    return (
        <div>
            Hi {username}
        </div>
    )
}

export default HomePage
