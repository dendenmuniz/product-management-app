type ItemBooleanProps = {
  attribute: string | React.ReactNode;
  name: string;
  value: boolean;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ItemBoolean = ({
  attribute,
  name,
  value,
  isEditing,
  onChange,
}: ItemBooleanProps) => {
  return (
    <div className="pb-2 border-b border-base-300 flex items-start justify-between">
      <div className="flex-wrap items-center justify-end gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{attribute}</legend>
          {isEditing ? (
            <div className="flex flex-wrap">
              <input
                type="checkbox"
                className="checkbox checkbox-sm ml-4"
                name={name}
                checked={value}
                onChange={(e) =>
                  onChange({
                    target: {
                      name,
                      value: e.target.checked.toString(),
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <legend
                className={`badge ${value ? "badge-soft badge-success" : "badge-ghost"} ml-4`}
              >
                {value ? "Yes" : "No"}
              </legend>
            </div>
          ) : (
            <div
              className={`badge ${value ? "badge-soft badge-success" : "badge-ghost"} ml-4`}
            >
              {value ? "Yes" : "No"}
            </div>
          )}
        </fieldset>
      </div>
    </div>
  );
};
