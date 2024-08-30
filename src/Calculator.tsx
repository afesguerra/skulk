import {
    Button,
    ColumnLayout,
    Container,
    ContentLayout,
    FormField,
    Header,
    Input,
    SpaceBetween,
    Tabs,
} from "@cloudscape-design/components";
import { useCallback, useState } from "react";
import { IncomeForm } from "./IncomeForm";
import { Income } from "./model";
import { Summary } from "./Summary.tsx";

const initialIncomes: Income[] = [{
    id: crypto.randomUUID(),
    name: `Loid Forger`,
    monthlyIncome: 2000,
    weeklyHours: 40,
    hoursOnHouseholdTasks: 0,
}, {
    id: crypto.randomUUID(),
    name: `Yor Forger`,
    monthlyIncome: 2000 * 30 / 40,
    weeklyHours: 30,
    hoursOnHouseholdTasks: 10,
}];

export const Calculator = () => {
    const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
    const [sharedExpenses, setSharedExpenses] = useState(500);
    const [sharedSavings, setSharedSavings] = useState(500);

    const saveIncomeOnId = useCallback((id: string) => (input: Income) => {
        setIncomes(prev => prev.map(v => v.id === id ? input : v));
    }, [setIncomes]);

    const incomeFormsHeader = <Header
        variant={"h1"}
        actions={<Button
            iconName={'add-plus'}
            onClick={() => setIncomes(prev => [...prev, {
                id: crypto.randomUUID(),
                name: `Fiona Frost`,
                monthlyIncome: 2000,
                weeklyHours: 40,
                hoursOnHouseholdTasks: 0,
            }])}>
            Add member
        </Button>}>
        Income Data
    </Header>;

    return (
        <ContentLayout>
            <SpaceBetween direction={"vertical"} size={"l"}>
                <Container header={incomeFormsHeader}>
                    <Tabs tabs={incomes.map((income, index) => ({
                        id: `${income.id}`,
                        label: `${income.name}`,
                        content: <IncomeForm
                            key={index}
                            income={income}
                            save={saveIncomeOnId(income.id)}
                        />,
                        dismissible: index > 1,
                        dismissLabel: 'Remove this household member',
                        onDismiss: () => setIncomes(prev => prev.filter(x => x.id !== income.id)),
                    }))}/>
                </Container>
                <Container header={<Header
                    variant={"h1"}
                    description={"In this section add items that apply for the whole household"}>Shared items</Header>}>
                    <ColumnLayout columns={2}>
                        <FormField label="Monthly expenses" description={"For common items like rent or groceries"}>
                            <Input
                                type={"number"}
                                value={`${sharedExpenses}`}
                                inputMode={"numeric"}
                                onChange={({detail}) => setSharedExpenses(+detail.value)}
                            />
                        </FormField>
                        <FormField label="Monthly savings" description={"For common goals like trips together"}>
                            <Input
                                type={"number"}
                                value={`${sharedSavings}`}
                                inputMode={"numeric"}
                                onChange={({detail}) => setSharedSavings(+detail.value)}
                            />
                        </FormField>
                    </ColumnLayout>
                </Container>
                <Summary
                    sharedItems={sharedExpenses + sharedSavings}
                    incomes={incomes}
                />
            </SpaceBetween>
        </ContentLayout>
    );
};
