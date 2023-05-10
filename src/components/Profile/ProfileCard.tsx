import { signUpWithCircle } from '@/server/actions';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Stack,
    StackDivider,
    Stat,
    StatHelpText,
    StatLabel,
    Text
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export type ProfileCardProps = {};

const ProfileCard = ({ }: ProfileCardProps) => {
    const { address, isConnected } = useAccount();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const onClick = async () => {
        setIsLoading(true);
        try {
            await signUpWithCircle(address!)
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Card maxW="md">
            <CardHeader>
                <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Avatar
                            name="Segun Adebayo"
                            src="https://bit.ly/sage-adebayo"
                        />
                        <Box>
                            <Heading size="sm">Welcome, user</Heading>
                            <Heading size="sm">Here are your details</Heading>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody>
                {session?.deposit_wallet == null ? (
                    <>
                        <Text>
                            Looks like you havent signed up with up only
                        </Text>
                        <br />
                        <Button
                            isLoading={isLoading}
                            colorScheme="green"
                            onClick={onClick}
                        >
                            Create your upOnly wallet with us!
                        </Button>
                    </>
                ) : (
                    <Stack divider={<StackDivider />} spacing="4">
                        <Stat>
                            <StatLabel>Your Current Wallet address</StatLabel>
                            <StatHelpText>{session.address}</StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle Wallet address</StatLabel>
                            <StatHelpText>
                                {session.deposit_wallet?.deposit_wallet_address}
                            </StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle Wallet ID</StatLabel>
                            <StatHelpText>
                                {session.deposit_wallet?.deposit_wallet_id}
                            </StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Name</StatLabel>
                            <StatHelpText>{session.name}</StatHelpText>
                        </Stat>
                        <Text></Text>
                    </Stack>
                )}
            </CardBody>
        </Card>
    );
};

export default ProfileCard;
