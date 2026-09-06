import { ChangeEvent, useState } from "react";
import { UserInterface } from "../interfaces/user";
import "../styles/select.css"

interface CustomSelectProps {
    options: UserInterface[];
    onChange: (selectedOption: UserInterface) => void;
    placeholder: boolean;
    onRemove?: (selectedOptionId: string) => void;
    searchTerm?: string;
    onSearchChange?: (text: string) => void;
    isLoading?: boolean;
}

const Select: React.FC<CustomSelectProps> = ({
    options,
    onChange,
    placeholder,
    onRemove,
    searchTerm,
    onSearchChange,
    isLoading = false,
}) => {
    const [selectedOption, setSelectedOption] = useState<UserInterface | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);

    const handlechange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const selected = options.find((option) => option._id === value) || null;
        setSelectedOption(selected);
        if (selected && placeholder) {
            setSelectedUsers((prev) =>
                prev.some((user) => user._id === selected._id)
                    ? prev
                    : [...prev, selected]
            );
        }
        selected && onChange(selected);
    };

    const removeSelectedUser = (id: string) => {
        setSelectedUsers((prev) => prev.filter((user) => user._id !== id));
        onRemove?.(id);
    };

    return (
        <div className="selectwrap">
            {onSearchChange && (
                <div className="selectsearchwrap">
                    <input
                        type="text"
                        className="selectsearchinput"
                        placeholder="Type to search users..."
                        value={searchTerm || ""}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {isLoading && <span className="selectsearchloader">Searching...</span>}
                </div>
            )}

            <select
                className="select"
                value={selectedOption ? selectedOption._id : ""}
                onChange={handlechange}
                disabled={options.length === 0}
            >
                {options.length === 0 ? (
                    <option value="" disabled>
                        {isLoading ? "Searching users..." : "No user to select"}
                    </option>
                ) : (
                    <>
                        <option value="">
                            {placeholder ? "Add participants to group" : "Add user to chat"}
                        </option>
                        {options.map((option) => (
                            <option key={option._id} value={option._id}>
                                {option.username} ({option.email})
                            </option>
                        ))}
                    </>
                )}
            </select>

            {options.length === 0 && !isLoading && (
                <div className="selectemptynote">
                    <span>⚠️ No user found to select</span>
                </div>
            )}

            {selectedUsers.length > 0 ? (
                <div className="selectedpills" aria-label="Selected participants">
                    {selectedUsers.map((item) => {
                        return (
                            <button
                                className="selectedpill"
                                key={item._id}
                                onClick={() => removeSelectedUser(item._id)}
                                type="button"
                            >
                                {item.username}
                                <span aria-hidden="true">×</span>
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default Select;
