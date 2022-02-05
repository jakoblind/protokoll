import React, { useState, useEffect } from "react";

import { useForm, useWatch } from "react-hook-form";

import { Packer } from "docx";
import { saveAs } from "file-saver";
import { generateGeneralforsamlingsprotokoll } from "../utils/docx-generator";
import { getStructuredData } from "../utils/data-transformer";

export function GeneralforsamlingForm() {
  const { register, handleSubmit, formState, setValue, watch } = useForm();
  const { errors, touchedFields } = formState;
  const onSubmit = (data) => {
    const doc = generateGeneralforsamlingsprotokoll(data);

    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `Generalforsamlingsprotokoll-${data.foretaksnavn}-${data.ar}.docx`
      );
    });
  };

  const data = watch();

  const styreleder = watch("styreleder");

  useEffect(() => {
    if (!touchedFields.moteleder) {
      setValue("moteleder", styreleder);
    }
    if (!touchedFields.protokollforer) {
      setValue("protokollforer", styreleder);
    }
    if (!touchedFields.ny_styreleder) {
      setValue("ny_styreleder", styreleder);
    }
  }, [styreleder, touchedFields, setValue]);

  return (
    <form className=" w-full max-w-m" onSubmit={handleSubmit(onSubmit)}>
      <Group header="Foretaksinformasjon">
        <TextField
          label="Foretaksnavn"
          name="foretaksnavn"
          register={register}
          required={true}
          errors={errors}
          autoFocus={true}
        />

        <TextField
          register={register}
          required={true}
          errors={errors}
          label="Styreleder"
          name="styreleder"
        />

        <RadioJaNei
          register={register}
          name="revisor"
          label="Revisor"
          defaultValue="nei"
          errors={errors}
        />
      </Group>
      <Group header="Inkallning og møtedeltager">
        <TextField
          register={register}
          required={true}
          label="Dato for generalforsamling"
          name="dato"
          type="date"
          defaultValue={getTodaysDate()}
          errors={errors}
        />
        <TextField
          register={register}
          required={true}
          label="Protokollfører"
          name="protokollforer"
          errors={errors}
        />
        <TextField
          register={register}
          required={true}
          label="Møteleder"
          name="moteleder"
          errors={errors}
        />
        <NInputs
          addText="Legg til fler møtedeltagere"
          register={register}
          errors={errors}
          inputTextLabel="Møtedeltager"
          inputTextName="motedeltager"
        />
      </Group>

      <Group header="Innhold og beslutninger">
        <TextField
          register={register}
          required={true}
          label="Gjelder for år"
          name="ar"
          defaultValue="2021"
          errors={errors}
        />
        <TextField
          register={register}
          required={true}
          label="Godtgjørelse styreleder per år (NOK)"
          name="godtgjorelse_styreleder"
          defaultValue="0"
          errors={errors}
        />
        <TextField
          register={register}
          required={true}
          label="Godtgjørelse styremedlemer per år (NOK)"
          name="godtgjorelse_styrmedlem"
          defaultValue="0"
          errors={errors}
        />

        <TextField
          register={register}
          required={false}
          label="Ny styreleder"
          name="ny_styreleder"
          errors={errors}
        />
        <NInputs
          addText="Legg til nytt styremedlem"
          register={register}
          errors={errors}
          inputTextLabel="Ny styremedlem"
          inputTextName="ny_styremedlem"
        />
        <NInputs
          addText="Legg til ekstra punkt, feks vedtekter"
          register={register}
          errors={errors}
          inputTextLabel="Punkt"
          inputTextName="ekstra_punkt_header"
          inputText2Label="Beskrivning"
          inputText2Name="ekstra_punkt_description"
        />

        <TextField
          register={register}
          required={true}
          label="Generalforsamling ble avsluttet klokken"
          name="tid_avsluttet"
          defaultValue="12:00"
          errors={errors}
        />
      </Group>

      <DocumentPreview data={data} />
      <p style={{ margin: "50px 0px 30px 0px" }}>
        <i>
          Dokumentet er et utkast som du kan gå gjennom. Jeg tar ikke noe ansvar
          for eventuelle feil og mangler i dokumentet.
        </i>
      </p>

      <div className="text-center md:items-center mb-6">
        <button
          className=" shadow bg-blue-700 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Last ned DOCX med generalforsamlingsprotokoll
        </button>
      </div>
    </form>
  );
}

function DocumentPreview({ data }) {
  return (
    <div className="mb-6 space-y-5 border-solid rounded-xl p-10 shadow-black-500 shadow-2xl">
      <div className="font-medium leading-tight text-4xl mt-0 mb-2 text-black-600">
        Protokoll fra generalforsamling
      </div>
      {getStructuredData(data).map((item) => {
        return (
          <div key={item.heading} className="space-y-3">
            <div className="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-600">
              {item.heading}
            </div>
            {item.description.map((desc) => (
              <p key={desc}>{desc}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

function TextField({
  label,
  id,
  name,
  defaultValue,
  placeholder,
  register,
  required,
  errors,
  autoFocus,
  type = "text",
  asTextArea = false,
}) {
  const error = errors ? errors[name] : null;
  const inputField = (
    <input
      className={`${
        error
          ? "border-red-500 focus:border-red-500 "
          : "border-gray-100 focus:border-blue-600"
      } appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white `}
      id={id || name}
      name={name}
      autoFocus={autoFocus}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      {...register(name, { required })}
    />
  );
  const textArea = (
    <textarea
      className={`${
        error
          ? "border-red-500 focus:border-red-500 "
          : "border-gray-100 focus:border-blue-600"
      } appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white `}
      id={id || name}
      name={name}
      autoFocus={autoFocus}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      {...register(name, { required })}
    />
  );
  return (
    <>
      <div className=" mb-6">
        <label
          className="block text-gray-100 font-bold mb-1 md:mb-0 pr-4"
          htmlFor={id || name}
        >
          {label}
          {required ? " *" : ""}
        </label>
        <div className="md:flex">
          <div className="md:w-1/2">
            {asTextArea ? textArea : inputField}
            {error && (
              <p className="text-red-500 text-s italic">Obligatoriskt felt</p>
            )}
          </div>
          <div className="md:w-1/2"></div>
        </div>
      </div>
    </>
  );
}

function RadioJaNei({ label, defaultValue, name, register }) {
  return (
    <div className="mb-6">
      <span className="block text-gray-100 font-bold  mb-1 md:mb-0 pr-4">
        {label}
      </span>

      <label className="inline-flex items-center">
        <input
          className="form-radio text-blue-600 h-5 w-5"
          type="radio"
          name={name}
          value="ja"
          defaultChecked={defaultValue === "ja"}
          {...register(name)}
        />
        <span className="ml-2">Ja</span>
      </label>
      <label className="inline-flex items-center ml-6">
        <input
          className="form-radio text-blue-600 h-5 w-5"
          type="radio"
          name={name}
          value="nei"
          defaultChecked={defaultValue === "nei"}
          {...register(name)}
        />
        <span className="ml-2">Nei</span>
      </label>
    </div>
  );
}

function Group({ children, header }) {
  return (
    <>
      {" "}
      <h3>{header}</h3>
      <hr className="pb-3" />
      {children}
      <div className="pb-10"></div>
    </>
  );
}

function NInputs({
  addText,
  register,
  errors,
  inputTextLabel,
  inputTextName,
  inputText2Label,
  inputText2Name,
}) {
  const [nInputs, addInput] = useState(0);

  const AddInputButton = () => (
    <div>
      <button
        type="button"
        className="text-blue-600 mb-6"
        onClick={(e) => {
          e.preventDefault();

          addInput(nInputs + 1);
        }}
      >
        {addText}
      </button>
    </div>
  );
  if (nInputs === 0) {
    return <AddInputButton />;
  } else {
    return (
      <>
        {[...Array(nInputs).keys()].map((n) => (
          <div key={`${inputTextLabel}-${n}`}>
            <TextField
              register={register}
              required={false}
              label={`${inputTextLabel} ${n + 1}`}
              name={`${inputTextName}${n + 1}`}
              errors={errors}
              autoFocus={true}
            />
            {inputText2Label && inputText2Name ? (
              <TextField
                register={register}
                required={false}
                label={`${inputText2Label} ${n + 1}`}
                name={`${inputText2Name}${n + 1}`}
                errors={errors}
                key={`${inputText2Label}-${n}`}
                asTextArea={true}
              />
            ) : null}
          </div>
        ))}
        <AddInputButton />
      </>
    );
  }
}
