import type { NextApiRequest, NextApiResponse } from 'next'
import { circleObject, prismaClient } from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Deposit_wallet } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { PaymentIntentCreationRequest } from '@circle-fin/circle-sdk'

export type GetUserBalanceResponse = {
    usdBalance: Number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (session && req.method === 'GET') {
        // Signed in
        try {
            console.log('fetch usd', session.deposit_wallet.deposit_wallet_id)
            const usdBalance = await getUserWalletBalance(
                session.deposit_wallet.deposit_wallet_id
            )
            console.log(usdBalance)
            res.status(200).json({
                usdBalance,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'error getting user wallet balance',
            })
        }
    } else {
        // Not Signed in
        res.status(401)
    }
}

const getUserWalletBalance = async (walletId: string) => {
    try {
        const wallet = await circleObject.wallets.getWallet(walletId)

        if (
            wallet.data.data === undefined ||
            wallet.data.data.balances?.length === 0
        ) {
            return 0
        }
        if (wallet.data.data.balances) {
            const usds = wallet.data.data.balances.filter(
                ({ currency }) => currency === 'USD'
            )

            return usds[0].amount
        }
        return 0
    } catch (e) {
        console.log(e)
    }
}

const createCryptoPayment = async (amount: string, address: string) => {
    const reqBody: PaymentIntentCreationRequest = {
        amount: {
            amount,
            currency: 'USD',
        },

        settlementCurrency: 'USD',
        paymentMethods: [
            {
                type: 'blockchain',
                chain: 'AVAX',
                address: address,
            },
        ],
        idempotencyKey: crypto.randomUUID(),
    }
    const resp = await circleObject.cryptoPaymentIntents.createPaymentIntent(
        reqBody
    )
    return resp
}
