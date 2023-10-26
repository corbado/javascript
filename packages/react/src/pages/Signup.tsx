import React from 'react';
import Text from '../components/Text';
import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';

const Signup = () => {
    return (
        <div>
            <Text variant="header">Header</Text>
            <Text variant="sub-header">Sub-header</Text>
            <div className="form-wrapper">
                <form>
                    <LabelledInput label='name' />
                    <LabelledInput label='name' />
                    <Button variant='primary'>Continue</Button>
                </form>
            </div>
        </div>
    )
}

export default Signup