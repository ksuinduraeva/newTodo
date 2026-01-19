import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,
} from "@mui/material";
import type { Task } from "../../../entities/model/types";
import type { TaskFormValues } from "../../../shared/forms/schemas/taskSchema";
import { taskSchema, mapFormToTask } from "../../../shared/forms/schemas/taskSchema";
import { IMPORTANCE_VALUES, IMPORTANCE_LABELS } from "../../../entities/model/constants";

type Props = {
    initialTask?: Task | null;
    onSaved?: (savedTask: Task) => void;
    submitLabel?: string;
};

const TodoForm: FC<Props> = ({ initialTask = null, onSaved, submitLabel }) => {
    const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } =
        useForm<TaskFormValues>({
            resolver: zodResolver(taskSchema) as unknown as Resolver<TaskFormValues>,
            defaultValues: {
                title: initialTask?.title ?? "",
                due: initialTask?.due ? initialTask.due.split("T")[0] : "",
                importance: initialTask?.importance ?? IMPORTANCE_VALUES[2],
            },
        });

    const onSubmit: SubmitHandler<TaskFormValues> = (formValues: TaskFormValues) => {
        const taskPayload = mapFormToTask(formValues, initialTask?.id);
        reset();
        onSaved?.(taskPayload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <TextField
                    {...register("title")}
                    label="Задача"
                    placeholder="название задачи"
                    size="small"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />

                <TextField
                    {...register("due")}
                    label="Сделать до"
                    type="date"
                    slotProps={{
                        inputLabel: { shrink: true }}}
                    size="small"
                    error={!!errors.due}
                    helperText={errors.due?.message}
                />

                <FormControl component="fieldset" error={!!errors.importance}>
                    <FormLabel component="legend">Важность</FormLabel>

                    <Controller
                        name="importance"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup row {...field}>
                                {IMPORTANCE_VALUES.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio size="small" />}
                                        label={IMPORTANCE_LABELS[option]}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                    />

                    {errors.importance?.message && (
                        <FormHelperText error>{errors.importance?.message}</FormHelperText>
                    )}
                </FormControl>

                <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ alignSelf: "flex-start" }}>
                    {submitLabel ?? (initialTask ? "Сохранить" : "Добавить задачу")}
                </Button>
            </Stack>
        </form>
    );
};

export default TodoForm;
