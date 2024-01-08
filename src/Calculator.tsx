import {
    Box,
    ColumnLayout,
    Container,
    ContentLayout,
    FormField,
    Header,
    Input,
    SpaceBetween
} from "@cloudscape-design/components"
import { useState } from "react";
import { ContributionSummary } from "./ContributionSummary";
import { IncomeForm } from "./IncomeForm";
import { Income } from "./model";

const buildIncomeArray = (count: number): Income[] => Array.from({length: count})
    .map((_, i): Income => ({
        monthlyIncome: 2000 * (40 - (i * 10)) / 40,
        weeklyHours: 40 - (i * 10),
        hoursOnFamilyTasks: i * 10,
    }));

export const Calculator = () => {
    const [memberCount] = useState(2);
    const [incomes, setIncomes] = useState(buildIncomeArray(memberCount));
    const [sharedExpenses, setSharedExpenses] = useState(500);
    const [sharedSavings, setSharedSavings] = useState(500);

    const saveIncomeOnIndex = (index: number) => (input: Income) => {
        setIncomes(prev => prev.map((v, i) => i === index ? input : v));
    };

    const maxWeeklyHours = Math.max(...incomes.map(x => x.weeklyHours));
    const totalWeeklyHours = incomes.map(x => x.weeklyHours).reduce((a, b) => a + b, 0);
    const totalIncome = incomes.map(x => x.monthlyIncome).reduce((a, b) => a + b, 0);
    const avgHoursOnFamilyTasks = incomes.map(x => x.hoursOnFamilyTasks).reduce((a, b) => a + b, 0) / incomes.length;
    const sharedItems = sharedExpenses + sharedSavings;

    return <ContentLayout>
        <SpaceBetween direction={'vertical'} size={'l'}>
            <Container header={<Header variant={'h1'}>Income Data</Header>}>
                <ColumnLayout columns={memberCount}>
                    {incomes.map(
                        (income, index) =>
                            <Box>
                                <Header variant={'h3'}>Member {index}</Header>
                                <IncomeForm
                                    key={index}
                                    income={income}
                                    save={saveIncomeOnIndex(index)}
                                />
                            </Box>
                    )}
                </ColumnLayout>
            </Container>
            <Container header={<Header variant={'h1'}>Shared items</Header>}>
                <ColumnLayout columns={2}>
                    <FormField label="Monthly shared expenses and savings">
                        <Input
                            type={"number"}
                            value={`${sharedExpenses}`}
                            inputMode={"numeric"}
                            onChange={({detail}) => setSharedExpenses(+detail.value)}
                        />
                    </FormField>
                    <FormField label="Monthly shared savings">
                        <Input
                            type={"number"}
                            value={`${sharedSavings}`}
                            inputMode={"numeric"}
                            onChange={({detail}) => setSharedSavings(+detail.value)}
                        />
                    </FormField>
                </ColumnLayout>
            </Container>
            <Container header={<Header variant={'h1'}>Summary</Header>}>
                <ColumnLayout columns={5} variant={'text-grid'}>
                    <div>
                        <Box variant="awsui-key-label">Total income</Box>
                        <div>{totalIncome}</div>
                    </div>
                    <div>
                        <Box variant="awsui-key-label">Total savings</Box>
                        <div>{totalIncome - sharedItems}</div>
                    </div>
                    <div>
                        <Box variant="awsui-key-label">Average hours spent on family tasks</Box>
                        <div>{avgHoursOnFamilyTasks}</div>
                    </div>
                    <div>
                        <Box variant="awsui-key-label">Total of hours worked in a week</Box>
                        <div>{totalWeeklyHours}</div>
                    </div>
                    <div>
                        <Box variant="awsui-key-label">Max weekly hours worked</Box>
                        <div>{maxWeeklyHours}</div>
                    </div>
                </ColumnLayout>
            </Container>
            <Container header={<Header variant={'h1'}>Distribution</Header>}>
                <ColumnLayout columns={memberCount} variant={'text-grid'}>
                    {incomes.map((income, index) =>
                        <ContributionSummary
                            key={index}
                            avgHoursOnFamilyTasks={avgHoursOnFamilyTasks}
                            maxWeeklyHours={maxWeeklyHours}
                            totalWeeklyHours={totalWeeklyHours}
                            totalIncome={totalIncome}
                            income={income}
                            sharedPoolContributions={sharedItems}
                        />
                    )}
                </ColumnLayout>
            </Container>
        </SpaceBetween>
    </ContentLayout>
}