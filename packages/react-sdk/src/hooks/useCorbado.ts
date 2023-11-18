import CorbadoContext, {CorbadoContextInterface} from "../contexts/CorbadoContext";
import {useContext} from "react";

const useCorbado = (context = CorbadoContext): CorbadoContextInterface =>
    useContext(context) as CorbadoContextInterface

export default useCorbado;
