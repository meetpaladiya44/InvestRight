import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { FaCopy, FaCheck } from 'react-icons/fa';

const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const schemaUID = "0x3a2e12a15e7e22546834f0b96bcce7f0596cedfa952b1e6b43d3569f682eb6e8";

const AttestationComponent = ({ stakeData, signer, onAttestationComplete }) => {
    const [attestationStatus, setAttestationStatus] = useState('');
    const [error, setError] = useState(null);
    const [attestationUrl, setAttestationUrl] = useState('');
    const attestationCreated = useRef(false);
    const stakeDataRef = useRef(stakeData);
    const signerRef = useRef(signer);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(attestationUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const slicedUrl = attestationUrl && attestationUrl.length > 50
        ? attestationUrl.slice(0, 47) + '...'
        : attestationUrl;

    const createAttestation = useCallback(async () => {
        if (attestationCreated.current) return;
        attestationCreated.current = true;

        try {
            const eas = new EAS(easContractAddress);
            eas.connect(signerRef.current);

            const schemaEncoder = new SchemaEncoder("uint256 predictionID,string worldID,string yourView,uint256 stakeAmount");
            const encodedData = schemaEncoder.encodeData([
                { name: "predictionID", value: BigInt(stakeDataRef.current.predictionID), type: "uint256" },
                { name: "worldID", value: stakeDataRef.current.worldID, type: "string" },
                { name: "yourView", value: stakeDataRef.current.yourView, type: "string" },
                { name: "stakeAmount", value: ethers.parseUnits(stakeDataRef.current.stakeAmount), type: "uint256" }
            ]);

            const signerAddress = await signerRef.current.getAddress();

            const tx = await eas.attest({
                schema: schemaUID,
                data: {
                    recipient: signerAddress,
                    expirationTime: 0n,
                    revocable: false,
                    data: encodedData,
                },
            }, {
                gasLimit: 500000,
            });

            setAttestationStatus('Attestation transaction sent. Waiting for confirmation...');

            const receipt = await tx.wait();
            console.log(receipt);
            setAttestationStatus('Attestation created successfully');

            // Generate the attestation URL
            const attestationUID = receipt // Assuming the UID is in the first log's second topic
            const baseUrl = "https://sepolia.easscan.org"
            const url = `${baseUrl}/attestation/view/${attestationUID}`;
            setAttestationUrl(url);

            onAttestationComplete(receipt.transactionHash);
        } catch (error) {
            setError(error);
            setAttestationStatus('Error creating attestation');
        }
    }, [onAttestationComplete]);

    useEffect(() => {
        if (stakeDataRef.current && signerRef.current) {
            createAttestation();
        }
    }, [createAttestation]);

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            {error && (
                <p className="text-red-500 mt-2">
                    Something went wrong!!!
                </p>
            )}
            {slicedUrl && (
                <div>
                    <label
                        htmlFor="url"
                        className="inline-block mb-1 font-medium py-4"
                        style={{ fontSize: "18px" }}
                    >
                        Link for Attestation
                    </label>
                    <div
                        id="url"
                        className="p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 overflow-x-auto whitespace-nowrap"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <a
                            href={attestationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "blue" }}
                        >
                            {slicedUrl}
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="text-[#644df4] hover:text-[#4e3ac2] focus:outline-none transition-colors duration-200"
                            style={{
                                marginLeft: "10px",
                                animation: "pulse 1.5s infinite",
                            }}
                            title={copied ? "Copied!" : "Copy to clipboard"}
                        >
                            {copied ? (
                                <FaCheck className="h-6 w-6" />
                            ) : (
                                <FaCopy className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttestationComponent;