import React, { FormEvent } from 'react';
import { Input, Typography } from 'kit';
import css from './styles.module.scss';
import store from '../../store';
import { observer } from 'mobx-react-lite';

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
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const { vidBalance } = store;
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
  };
  const handlePercentClick = (value: number) => {
    onChange(((vidBalance / 100) * value).toFixed(5));
  };
  return (
    <div className={css.amount}>
      <div className={css.amountAvailable}>
        <Typography>Available in Wallet:</Typography>
        <Typography type="body">{vidBalance}</Typography>&nbsp;
        <Typography>VID</Typography>
      </div>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        label="Amount To Stake"
        postfix={() => <PercentAmount onClick={handlePercentClick} />}
      />
    </div>
  );
};

export default observer(AmountInput);
