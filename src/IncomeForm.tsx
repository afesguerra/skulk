import { FormField, Input, SpaceBetween } from "@cloudscape-design/components"
import { Income } from "./model";

export interface IncomeFormProps {
    readonly income: Income;
    readonly save: (income: Income) => void;
}

export const IncomeForm = ({income, save}: IncomeFormProps) =>
    <SpaceBetween size={"m"} direction={"vertical"}>
        <FormField label="Name">
            <Input
                type={"text"}
                value={`${income.name}`}
                inputMode={"text"}
                onChange={({detail}) => save({...income, name: detail.value})}
            />
        </FormField>
        <FormField
            label="Monthly income"
            description='How much money do you make every month?'>
            <Input
                type={"number"}
                value={`${income.monthlyIncome}`}
                inputMode={"numeric"}
                onChange={({detail}) => save({...income, monthlyIncome: +detail.value})}
            />
        </FormField>
        <FormField
            label="Weekly hours"
            description='How many hours a week do you work?'>
            <Input
                type={"number"}
                value={`${income.weeklyHours}`}
                inputMode={"numeric"}
                onChange={({detail}) => save({...income, weeklyHours: +detail.value})}
            />
        </FormField>
        <FormField
            label="Weekly hours on household tasks"
            description='How many hours a week do you spend doing household tasks?'>
            <Input
                type={"number"}
                value={`${income.hoursOnHouseholdTasks}`}
                inputMode={"numeric"}
                onChange={({detail}) => save({...income, hoursOnHouseholdTasks: +detail.value})}
            />
        </FormField>
    </SpaceBetween>;