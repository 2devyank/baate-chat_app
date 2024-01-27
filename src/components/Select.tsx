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
const [name,setname]=useState<string[]>([]);

    const handlechange=(e:ChangeEvent<HTMLSelectElement>)=>{
        const value=e.target.value;
        // const {userna÷me}=e.target.value;
        console.log("value",value.split(","))
        const selected=options.find((option)=>option._id===value.split(",")[0])||null;
        setSelectedOption(selected);
        setname([...name,value.split(",")[1]]);
        selected && onChange(selected);
    }
console.log(selectedOption,"selected")
    return(
        <>
        <select className="select" value={selectedOption?selectedOption.username:""} onChange={handlechange}>
<option >
{selectedOption?selectedOption.username:placeholder?"add participants to group":"Add user to chat"}
</option>
{
    options.map((option)=>(
        <option key={option._id} value={[option._id,option.username]}>
            {option.username}
        </option>
    ))
}
</select>
      {name.map((item)=>{
          return (
              <p>
                {item}
            </p>
        )
    })}

    </>
)
}

export default Select;