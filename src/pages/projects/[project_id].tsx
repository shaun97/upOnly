import { getProject } from '@/server/actions'
import { Prisma, Project } from '@prisma/client'
import { useRouter } from 'next/router'
import { GetProjectData, getSingleProject } from '../api/projects/[project_id]'
import {
    Card,
    CardHeader,
    Flex,
    Avatar,
    Heading,
    IconButton,
    CardBody,
    CardFooter,
    Button,
    Box,
    Text,
    Image,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StackDivider,
    Stack,
    Spinner,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from '@chakra-ui/react'
import { useState } from 'react'

type ProjectDetailPageProp = {
    project: {
        created_time: Date
        project_id: number
        smart_contract_address: string
        deposit_wallet_address: string
        deposit_wallet_id: string
        status: string
        project_details: string
        project_title: string
        completion_time: string
        goal_time: string
        targeted_amount: Prisma.Decimal
        raised_amount: Prisma.Decimal
    }
}
const displayDate = (createdDate: string) => {
    const date = new Date(createdDate)
    return date.toISOString()
}
export default function Page(props: ProjectDetailPageProp) {
    const router = useRouter()

    const { project } = props
    const [donateAmount, setDonateAmount] = useState<number>(0)
    if (project === null) {
        return <></>
    }
    const {
        project_title,
        project_details,
        goal_time,
        completion_time,
        targeted_amount,
        raised_amount,
        status,
        deposit_wallet_address,
    } = project

    return (
        <Flex direction={'row'} justifyContent={'center'}>
            {' '}
            <Card maxW="lg" variant="filled">
                <CardHeader>
                    <Heading size="md">{project_title}</Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                        <Image
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                            alt="Green double couch with wooden legs"
                            borderRadius="lg"
                        />

                        <Stat>
                            <StatLabel>Raised Amount</StatLabel>
                            <StatNumber>{raised_amount.toString()}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Goal Amount</StatLabel>
                            <StatNumber>
                                {targeted_amount.toString()}
                            </StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Goal time</StatLabel>
                            <StatNumber>{displayDate(goal_time)}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Completion Time</StatLabel>
                            <StatNumber>
                                {displayDate(completion_time)}
                            </StatNumber>
                        </Stat>
                        <Text>{project_details}</Text>
                        <>
                            <Stat>
                                <StatLabel>Amount you are donating</StatLabel>
                            </Stat>
                            <NumberInput size="sm" defaultValue={15} min={10}>
                                <NumberInputField />
                            </NumberInput>{' '}
                        </>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <Button colorScheme="teal" variant="solid">
                        Donate bro
                    </Button>
                </CardFooter>
            </Card>
        </Flex>
    )
}

export async function getServerSideProps({
    query: { project_id },
}: {
    query: { project_id: string }
}) {
    const projectData = await JSON.parse(
        JSON.stringify(await getSingleProject(parseInt(project_id)))
    )

    return {
        props: {
            project: {
                ...projectData,
            },
        },
    }
}