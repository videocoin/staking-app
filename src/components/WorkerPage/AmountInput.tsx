import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatToken } from 'lib/units';
import { observer } from 'mobx-react-lite';
import React, { FormEvent } from 'react';
import { Input, Typography } from 'ui-kit';
import { StakeType } from './StakeToggle';
import css from './styles.module.scss';

const percentage = [25, 50, 75, 100];

const PercentAmount = ({ onClick }: { onClick: (val: number) => void }) => {
  const handleClick = (value: number) => () => onClick(value);
  const renderBtn = (value: number) => (
    <button type="button" onClick={handleClick(value)} key={value}>
      <Typography type="button" theme="white">
        {value}%
      </Typography>
    </button>
  );
  return <div className={css.percentAmount}>{percentage.map(renderBtn)}</div>;
};

const AmountInput = ({
  value,
  totalValue,
  stake,
  onChange,
}: {
  value: string;
  totalValue: BigNumberish;
  stake: StakeType;
  onChange: (val: string) => void;
}) => {
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
  };
  const handlePercentClick = (value: number) => {
    const percentValue = BigNumber.from(totalValue).div(100).mul(value);
    const formattedPercentValue = formatToken(percentValue);
    onChange(formattedPercentValue);
  };
  const isUnstake = stake === StakeType.Unstake;
  const formattedTotalValue = formatToken(totalValue);
  const error = (value && +value <= 0) || +value > +formattedTotalValue;
  return (
    <div className={css.amount}>
      <div className={css.amountAvailable}>
        <Typography>
          {isUnstake ? 'Available to Unstake:' : 'Available in Wallet:'}
        </Typography>
        <Typography type="body">{formattedTotalValue}</Typography>
        &nbsp;
        <Typography>VID</Typography>
      </div>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        label={`Amount To ${isUnstake ? 'Unstake' : 'Stake'}`}
        postfix={() => <PercentAmount onClick={handlePercentClick} />}
        error={error}
        max={+formattedTotalValue}
        min={0}
      />
    </div>
  );
};

export default observer(AmountInput);
