import { AddressZero } from '@ethersproject/constants'
import {
  Gnosis_safe as GnosisSafe_V1_1_1,
  Multi_send as MultiSend_V1_1_1,
  Proxy_factory as ProxyFactory_V1_1_1
} from '@weichain/safe-ethers-lib/typechain/src/ethers-v5/v1.1.1'
import { Gnosis_safe as GnosisSafe_V1_2_0 } from '@weichain/safe-ethers-lib/typechain/src/ethers-v5/v1.2.0/'
import {
  Compatibility_fallback_handler as CompatibilityFallbackHandler_V1_3_0,
  Create_call as CreateCall_V1_3_0,
  Gnosis_safe as GnosisSafe_V1_3_0,
  Multi_send as MultiSend_V1_3_0,
  Multi_send_call_only as MultiSendCallOnly_V1_3_0,
  Proxy_factory as ProxyFactory_V1_3_0
} from '@weichain/safe-ethers-lib/typechain/src/ethers-v5/v1.3.0/'
import {
  DailyLimitModule,
  ERC20Mintable,
  SocialRecoveryModule
} from '@weichain/safe-ethers-lib/typechain/tests/ethers-v5/v1.2.0'
import { DebugTransactionGuard } from '@weichain/safe-ethers-lib/typechain/tests/ethers-v5/v1.3.0'
import { deployments, ethers } from 'hardhat'
import { AbiItem } from 'web3-utils'
import {
  compatibilityFallbackHandlerDeployed,
  createCallDeployed,
  gnosisSafeDeployed,
  multiSendCallOnlyDeployed,
  multiSendDeployed,
  proxyFactoryDeployed,
  signMessageLibDeployed
} from '../../hardhat/deploy/deploy-contracts'

export const getSafeSingleton = async (): Promise<{
  contract: GnosisSafe_V1_3_0 | GnosisSafe_V1_2_0 | GnosisSafe_V1_1_1
  abi: AbiItem | AbiItem[]
}> => {
  const SafeDeployment = await deployments.get(gnosisSafeDeployed.name)
  const Safe = await ethers.getContractFactory(gnosisSafeDeployed.name)
  return {
    contract: Safe.attach(SafeDeployment.address) as
      | GnosisSafe_V1_3_0
      | GnosisSafe_V1_2_0
      | GnosisSafe_V1_1_1,
    abi: SafeDeployment.abi
  }
}

export const getFactory = async (): Promise<{
  contract: ProxyFactory_V1_3_0 | ProxyFactory_V1_1_1
  abi: AbiItem | AbiItem[]
}> => {
  const FactoryDeployment = await deployments.get(proxyFactoryDeployed.name)
  const Factory = await ethers.getContractFactory(proxyFactoryDeployed.name)
  return {
    contract: Factory.attach(FactoryDeployment.address) as
      | ProxyFactory_V1_3_0
      | ProxyFactory_V1_1_1,
    abi: FactoryDeployment.abi
  }
}

export const getSafeTemplate = async (): Promise<
  GnosisSafe_V1_3_0 | GnosisSafe_V1_2_0 | GnosisSafe_V1_1_1
> => {
  const singleton = (await getSafeSingleton()).contract
  const factory = (await getFactory()).contract
  const template = await factory.callStatic.createProxy(singleton.address, '0x')
  await factory.createProxy(singleton.address, '0x').then((tx: any) => tx.wait())
  const Safe = await ethers.getContractFactory(gnosisSafeDeployed.name)
  return Safe.attach(template) as GnosisSafe_V1_3_0 | GnosisSafe_V1_2_0 | GnosisSafe_V1_1_1
}

export const getSafeWithOwners = async (
  owners: string[],
  threshold?: number,
  fallbackHandler?: string
): Promise<GnosisSafe_V1_3_0 | GnosisSafe_V1_2_0 | GnosisSafe_V1_1_1> => {
  const template = await getSafeTemplate()
  await template.setup(
    owners,
    threshold || owners.length,
    AddressZero,
    '0x',
    fallbackHandler || (await getCompatibilityFallbackHandler()).contract.address,
    AddressZero,
    0,
    AddressZero
  )
  return template as GnosisSafe_V1_3_0 | GnosisSafe_V1_2_0 | GnosisSafe_V1_1_1
}

export const getCompatibilityFallbackHandler = async (): Promise<{
  contract: CompatibilityFallbackHandler_V1_3_0
  abi: AbiItem | AbiItem[]
}> => {
  const CompatibilityFallbackHandlerDeployment = await deployments.get(
    compatibilityFallbackHandlerDeployed.name
  )
  const CompatibilityFallbackHandler = await ethers.getContractFactory(
    compatibilityFallbackHandlerDeployed.name
  )
  return {
    contract: CompatibilityFallbackHandler.attach(
      CompatibilityFallbackHandlerDeployment.address
    ) as CompatibilityFallbackHandler_V1_3_0,
    abi: CompatibilityFallbackHandlerDeployment.abi
  }
}

export const getMultiSend = async (): Promise<{
  contract: MultiSend_V1_3_0 | MultiSend_V1_1_1
  abi: AbiItem | AbiItem[]
}> => {
  const MultiSendDeployment = await deployments.get(multiSendDeployed.name)
  const MultiSend = await ethers.getContractFactory(multiSendDeployed.name)
  return {
    contract: MultiSend.attach(MultiSendDeployment.address) as MultiSend_V1_3_0 | MultiSend_V1_1_1,
    abi: MultiSendDeployment.abi
  }
}

export const getMultiSendCallOnly = async (): Promise<{
  contract: MultiSendCallOnly_V1_3_0
  abi: AbiItem | AbiItem[]
}> => {
  const MultiSendCallOnlyDeployment = await deployments.get(multiSendCallOnlyDeployed.name)
  const MultiSendCallOnly = await ethers.getContractFactory(multiSendCallOnlyDeployed.name)
  return {
    contract: MultiSendCallOnly.attach(
      MultiSendCallOnlyDeployment.address
    ) as MultiSendCallOnly_V1_3_0,
    abi: MultiSendCallOnlyDeployment.abi
  }
}

export const getSignMessageLib = async (): Promise<{
  contract: SignMessageLib_V1_3_0
  abi: AbiItem | AbiItem[]
}> => {
  const SignMessageLibDeployment = await deployments.get(signMessageLibDeployed.name)
  const SignMessageLib = await ethers.getContractFactory(signMessageLibDeployed.name)
  return {
    contract: SignMessageLib.attach(SignMessageLibDeployment.address) as SignMessageLib_V1_3_0,
    abi: SignMessageLibDeployment.abi
  }
}

export const getCreateCall = async (): Promise<{
  contract: CreateCall_V1_3_0
  abi: AbiItem | AbiItem[]
}> => {
  const CreateCallDeployment = await deployments.get(createCallDeployed.name)
  const CreateCall = await ethers.getContractFactory(createCallDeployed.name)
  return {
    contract: CreateCall.attach(CreateCallDeployment.address) as CreateCall_V1_3_0,
    abi: CreateCallDeployment.abi
  }
}

export const getDailyLimitModule = async (): Promise<DailyLimitModule> => {
  const DailyLimitModuleDeployment = await deployments.get('DailyLimitModule')
  const DailyLimitModule = await ethers.getContractFactory('DailyLimitModule')
  return DailyLimitModule.attach(DailyLimitModuleDeployment.address) as DailyLimitModule
}

export const getSocialRecoveryModule = async (): Promise<SocialRecoveryModule> => {
  const SocialRecoveryModuleDeployment = await deployments.get('SocialRecoveryModule')
  const SocialRecoveryModule = await ethers.getContractFactory('SocialRecoveryModule')
  return SocialRecoveryModule.attach(SocialRecoveryModuleDeployment.address) as SocialRecoveryModule
}

export const getERC20Mintable = async (): Promise<ERC20Mintable> => {
  const ERC20MintableDeployment = await deployments.get('ERC20Mintable')
  const ERC20Mintable = await ethers.getContractFactory('ERC20Mintable')
  return ERC20Mintable.attach(ERC20MintableDeployment.address) as ERC20Mintable
}

export const getDebugTransactionGuard = async (): Promise<DebugTransactionGuard> => {
  const DebugTransactionGuardDeployment = await deployments.get('DebugTransactionGuard')
  const DebugTransactionGuard = await ethers.getContractFactory('DebugTransactionGuard')
  return DebugTransactionGuard.attach(
    DebugTransactionGuardDeployment.address
  ) as DebugTransactionGuard
}

export const getDefaultCallbackHandler = async (): Promise<DefaultCallbackHandler> => {
  const DefaultCallbackHandlerDeployment = await deployments.get('DefaultCallbackHandler')
  const DefaultCallbackHandler = await ethers.getContractFactory('DefaultCallbackHandler')
  return DefaultCallbackHandler.attach(
    DefaultCallbackHandlerDeployment.address
  ) as DefaultCallbackHandler
}
