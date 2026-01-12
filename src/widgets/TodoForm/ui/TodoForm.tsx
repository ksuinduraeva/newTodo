import type { FC, ChangeEvent } from "react";
import type { Importance } from "../../../entities/model/types";
import { Stack,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio } from "@mui/material";


type Props = {
    title: string;
    onTitleChange: (value: string) => void;
    due: string;
    onDueChange: (value: string) => void;
    importance: Importance;
    onImportanceChange: (value: Importance) => void;
    onAdd: () => void;
};

const TodoForm: FC<Props> = ({
                                 title,
                                 onTitleChange,
                                 due,
                                 onDueChange,
                                 importance,
                                 onImportanceChange,
                                 onAdd,
                             }) => {

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onTitleChange(event.target.value);
    };

    const handleDueChange = (event: ChangeEvent<HTMLInputElement>) => {
        onDueChange(event.target.value);
    };

    const handleImportanceChange = (event: ChangeEvent<HTMLInputElement>) => {
        onImportanceChange(event.target.value as Importance);
    };

    const handleAddClick = () => {
        onAdd();
    };

    return (
        <Stack spacing={2}>
            <TextField
                label="Задача"
                placeholder="название задачи"
                value={title}
                onChange={handleTitleChange}
                size="small"
                fullWidth
            />

            <TextField
                label="Сделать до"
                type="date"
                value={due}
                onChange={handleDueChange}
                slotProps={{
                    inputLabel: {shrink: true},
                    htmlInput: {'aria-label': 'Сделать до'}
                }}
                size="small"
            />

            <FormControl component="fieldset">
                <FormLabel component="legend">Важность</FormLabel>

                <RadioGroup
                    row
                    name="importance"
                    value={importance}
                    onChange={handleImportanceChange}
                >
                    <FormControlLabel
                        value="urgent_not_important"
                        control={<Radio size="small" />}
                        label="Срочно, но неважно"
                    />
                    <FormControlLabel
                        value="urgent_important"
                        control={<Radio size="small" />}
                        label="Срочно и важно"
                    />
                    <FormControlLabel
                        value="not_urgent_important"
                        control={<Radio size="small" />}
                        label="Не срочно, но важно"
                    />
                    <FormControlLabel
                        value="not_urgent_not_important"
                        control={<Radio size="small" />}
                        label="Не срочно и не важно"
                    />
                </RadioGroup>
            </FormControl>

            <Button
                variant="contained"
                onClick={handleAddClick}
                sx={{ alignSelf: "flex-start" }}
            >
                Добавить задачу
            </Button>
        </Stack>
    );
};

export default TodoForm;
