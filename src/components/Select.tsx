import { ChangeEvent, useState } from "react";
import { UserInterface } from "../interfaces/user";
import "../styles/select.css"

interface CustomSelectProps{
    options:UserInterface[],
    onChange:(selectedOption:UserInterface)=>void;
    placeholder:boolean
}

const Select:React.FC<CustomSelectProps>=({options,onChange,placeholder})=>{
const [selectedOption,setSelectedOption]=useState<UserInterface|null>();

    const handlechange=(e:ChangeEvent<HTMLSelectElement>)=>{
        const value=e.target.value;
        console.log("value",value)
        const selected=options.find((option)=>option._id===value)||null;
        setSelectedOption(selected);
        selected && onChange(selected);
    }
console.log(selectedOption,"selected")
    return(
        <select className="select" value={selectedOption?selectedOption.username:""} onChange={handlechange}>
<option value="">
{/* {placeholder?"add participants to group":"Add user to chat"} */}
</option>
{
    options.map((option)=>(
        <option key={option._id} value={option._id}>
            {option.username}
        </option>
    ))
}
      
</select>
)
}

export default Select;