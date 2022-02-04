import { Button } from "@chakra-ui/button";
import { useLocales } from "hooks/useLocales";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  ExampleChildDto,
  ExampleChildFetchClient,
  SwaggerException
} from "services/backend/client.generated";
import { handleNSwagException } from "services/backend/handleNSwagException";
import { useNSwagClient } from "services/backend/useNSwagClient";

import MyInput from "./Form/Input";

const FormErrors: FC = () => {
  const { t } = useLocales();

  const { genClient } = useNSwagClient(ExampleChildFetchClient, true);

  const { handleSubmit, reset, formState, control, setError } = useForm<ExampleChildDto>();
  const { isDirty, isValid } = formState;

  const fetchData = useCallback(
    async (child: ExampleChildDto) => {
      try {
        const exampleClient = await genClient();
        await exampleClient.exampleChild_CreateChild(child);
        reset();
      } catch (err) {
        console.error(err);
        if (SwaggerException.isSwaggerException(err)) {
          Object.entries(handleNSwagException(err).attributeErrors).forEach(
            ([attribute, errors]) => {
              const message = errors.reduce(
                (acc, x) => ({ ...acc, [x]: t("errors.nswag." + x) }),
                {}
              );

              setError(attribute as keyof ExampleChildDto, {
                type: "manual",
                message: "Following errors occurred",
                types: message
              });
            }
          );
        }
      }
    },
    [genClient, reset, t, setError]
  );

  return (
    <form onSubmit={handleSubmit(fetchData)}>
      <MyInput
        controller={{
          control,
          name: "name",
          rules: {
            minLength: 3 // Note there is a discrepancy between backend and frontend for example reasons.
          }
        }}
        label={t("example.form.label.name")}
        placeholder={t("example.form.placeholder.name")}
      />
      <Button mt={4} isDisabled={!isDirty || !isValid} colorScheme="teal" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default FormErrors;
