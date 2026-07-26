import { ChangeEvent, useState } from "react";
import { UserInterface } from "../interfaces/user";
import "../styles/select.css"

interface CustomSelectProps{
    options:UserInterface[],
    onChange:(selectedOption:UserInterface)=>void;
    placeholder:boolean;
    onRemove?:(selectedOptionId:string)=>void;
}

const Select:React.FC<CustomSelectProps>=({options,onChange,placeholder,onRemove})=>{
const [selectedOption,setSelectedOption]=useState<UserInterface|null>();
const [selectedUsers,setSelectedUsers]=useState<UserInterface[]>([]);

    const handlechange=(e:ChangeEvent<HTMLSelectElement>)=>{
        const value=e.target.value;
        const selected=options.find((option)=>option._id===value)||null;
        setSelectedOption(selected);
        if (selected && placeholder) {
            setSelectedUsers((prev) =>
                prev.some((user) => user._id === selected._id)
                    ? prev
                    : [...prev, selected]
            );
        }
        selected && onChange(selected);
    }

    const removeSelectedUser = (id:string) => {
        setSelectedUsers((prev) => prev.filter((user) => user._id !== id));
        onRemove?.(id);
    }

    return(
        <div className="selectwrap">
        <select className="select" value={selectedOption?selectedOption._id:""} onChange={handlechange}>
<option value="">
{placeholder?"Add participants to group":"Add user to chat"}
</option>
{
    options.map((option)=>(
        <option key={option._id} value={option._id}>
            {option.username}
        </option>
    ))
}
</select>
      {selectedUsers.length > 0 ? (
        <div className="selectedpills" aria-label="Selected participants">
      {selectedUsers.map((item)=>{
          return (
              <button
                className="selectedpill"
                key={item._id}
                onClick={() => removeSelectedUser(item._id)}
                type="button"
              >
                {item.username}
                <span aria-hidden="true">x</span>
            </button>
        )
    })}
        </div>
      ) : null}

    </div>
)
}

export default Select;
